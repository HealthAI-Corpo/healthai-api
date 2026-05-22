import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { CreateProfilSanteDto } from './dto/create-profil-sante.dto';
import { UpdateProfilSanteDto } from './dto/update-profil-sante.dto';
import { ProfilSante } from './entities/profil-sante.entity';
import { ProfilSanteService } from './profil-sante.service';

const mockProfilComplet: ProfilSante = {
  idProfil: 1,
  idUtilisateur: 1,
  poidsKg: 75,
  tailleCm: 178,
  imc: 23.7,
  niveauActivite: 'Modéré',
  niveauSportif: 'intermédiaire',
  objectifPrincipal: 'perte de poids',
  experienceSportive: 'intermédiaire',
  frequenceEntrainement: 3,
  typeMaladie: null,
  severite: null,
  restrictionsAlimentaires: null,
  allergies: null,
  age: 28,
  equipementDisponible: 'Haltères, tapis de course',
  hrRest: 58,
  hrMax: 195,
  hrAvg: 140,
  bodyFatPct: 18.5,
  utilisateur: null,
};

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('ProfilSanteService', () => {
  let service: ProfilSanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilSanteService,
        { provide: getRepositoryToken(ProfilSante), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ProfilSanteService>(ProfilSanteService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── Scénario 1 : Création profil complet ───────────────────────────────
  describe('create — profil complet (US-2 scénario 1)', () => {
    it('doit sauvegarder tous les champs y compris HR et masse grasse', async () => {
      const dto: CreateProfilSanteDto = {
        idUtilisateur: 1,
        poidsKg: 75,
        tailleCm: 178,
        niveauSportif: 'intermédiaire',
        objectifSportif: 'perte de poids',
        age: 28,
        equipementDisponible: 'Haltères, tapis de course',
        hrRest: 58,
        hrMax: 195,
        hrAvg: 140,
        bodyFatPct: 18.5,
      };

      mockRepo.create.mockReturnValue(mockProfilComplet);
      mockRepo.save.mockResolvedValue(mockProfilComplet);

      const result = await service.create(dto);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      expect(result.hrRest).toBe(58);
      expect(result.hrMax).toBe(195);
      expect(result.hrAvg).toBe(140);
      expect(result.bodyFatPct).toBe(18.5);
      expect(result.niveauSportif).toBe('intermédiaire');
    });
  });

  // ─── Scénario 2 : Création profil minimal ───────────────────────────────
  describe('create — profil minimal (US-2 scénario 2)', () => {
    it('doit sauvegarder avec champs optionnels à null', async () => {
      const dto: CreateProfilSanteDto = {
        idUtilisateur: 2,
        niveauSportif: 'débutant',
      };

      const profilMinimal: ProfilSante = {
        ...mockProfilComplet,
        idProfil: 2,
        idUtilisateur: 2,
        poidsKg: null,
        tailleCm: null,
        niveauSportif: 'débutant',
        hrRest: null,
        hrMax: null,
        hrAvg: null,
        bodyFatPct: null,
        equipementDisponible: null,
        age: null,
      };

      mockRepo.create.mockReturnValue(profilMinimal);
      mockRepo.save.mockResolvedValue(profilMinimal);

      const result = await service.create(dto);

      expect(result.niveauSportif).toBe('débutant');
      expect(result.hrRest).toBeNull();
      expect(result.hrMax).toBeNull();
      expect(result.bodyFatPct).toBeNull();
      expect(result.equipementDisponible).toBeNull();
    });
  });

  // ─── Scénario 3 : Mise à jour partielle ─────────────────────────────────
  describe('update — mise à jour partielle (US-2 scénario 3)', () => {
    it('doit mettre à jour uniquement hrMax sans toucher aux autres champs', async () => {
      const dto: UpdateProfilSanteDto = { hrMax: 200 };
      const updated = { ...mockProfilComplet, hrMax: 200 };

      mockRepo.findOne.mockResolvedValue(mockProfilComplet);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(result.hrMax).toBe(200);
      expect(result.hrRest).toBe(58);   // inchangé
      expect(result.hrAvg).toBe(140);   // inchangé
      expect(result.niveauSportif).toBe('intermédiaire'); // inchangé
    });

    it('doit lever NotFoundException si le profil n\'existe pas', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.update(999, { hrMax: 200 })).rejects.toThrow(NotFoundException);
    });
  });

  // ─── Scénario 4 : Validation — champ obligatoire manquant ───────────────
  describe('DTO validation — niveauSportif obligatoire (US-2 scénario 4)', () => {
    it('doit rejeter un DTO sans niveauSportif', async () => {
      const dto = plainToInstance(CreateProfilSanteDto, {
        idUtilisateur: 1,
        poidsKg: 75,
        // niveauSportif absent
      });
      const errors = await validate(dto);
      const field = errors.find((e) => e.property === 'niveauSportif');
      expect(field).toBeDefined();
    });

    it('doit rejeter un niveauSportif invalide', async () => {
      const dto = plainToInstance(CreateProfilSanteDto, {
        idUtilisateur: 1,
        niveauSportif: 'expert', // valeur non autorisée
      });
      const errors = await validate(dto);
      const field = errors.find((e) => e.property === 'niveauSportif');
      expect(field).toBeDefined();
    });

    it('doit accepter les trois niveaux valides', async () => {
      for (const niveau of ['débutant', 'intermédiaire', 'avancé']) {
        const dto = plainToInstance(CreateProfilSanteDto, {
          idUtilisateur: 1,
          niveauSportif: niveau,
        });
        const errors = await validate(dto);
        const field = errors.find((e) => e.property === 'niveauSportif');
        expect(field).toBeUndefined();
      }
    });
  });

  // ─── findByUserId ────────────────────────────────────────────────────────
  describe('findByUserId', () => {
    it('doit retourner le profil de l\'utilisateur', async () => {
      mockRepo.findOne.mockResolvedValue(mockProfilComplet);
      const result = await service.findByUserId(1);
      expect(result).toEqual(mockProfilComplet);
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { idUtilisateur: 1 } });
    });

    it('doit lever NotFoundException si l\'utilisateur n\'a pas de profil', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findByUserId(999)).rejects.toThrow(NotFoundException);
    });
  });
});
