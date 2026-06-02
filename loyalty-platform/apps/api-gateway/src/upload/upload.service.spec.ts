import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  describe('upload', () => {
    it('should save file and return file info', async () => {
      const file = {
        originalname: 'photo.jpg',
        buffer: Buffer.from('test'),
        size: 4,
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const result = await service.upload(file);
      expect(result.url).toContain('/uploads/');
      expect(result.url).toContain('photo.jpg');
      expect(result.fileName).toContain('photo.jpg');
      expect(result.size).toBe(4);
      expect(result.mimetype).toBe('image/jpeg');
    });
  });
});
