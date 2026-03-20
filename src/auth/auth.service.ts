import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Utilisateur } from '../database/entities/utilisateur.entity';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: number;
  email: string;
}

const BCRYPT_HASH_PATTERN = /^\$2[abxy]\$\d{2}\$[./A-Za-z0-9]{53}$/;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { email },
    });

    const hasValidPasswordHash =
      typeof utilisateur?.motDePasseHash === 'string' &&
      BCRYPT_HASH_PATTERN.test(utilisateur.motDePasseHash);

    if (
      !utilisateur ||
      !hasValidPasswordHash ||
      !(await bcrypt.compare(password, utilisateur.motDePasseHash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: utilisateur.idUtilisateur,
      email: utilisateur.email,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        issuer: this.configService.getOrThrow<string>('JWT_ISSUER'),
        audience: this.configService.getOrThrow<string>('JWT_AUDIENCE'),
      }),
    };
  }

  async validateUser(payload: JwtPayload): Promise<Utilisateur | null> {
    return this.utilisateurRepository.findOne({
      where: { idUtilisateur: payload.sub },
    });
  }
}
