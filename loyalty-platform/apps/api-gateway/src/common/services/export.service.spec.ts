import { Test, TestingModule } from '@nestjs/testing';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportService],
    }).compile();

    service = module.get<ExportService>(ExportService);
  });

  describe('toCsv', () => {
    it('should convert data to CSV string', async () => {
      const data = [
        { name: 'Alice', points: 100 },
        { name: 'Bob', points: 200 },
      ];
      const columns = [
        { key: 'name' as keyof typeof data[0], label: 'Name' },
        { key: 'points' as keyof typeof data[0], label: 'Points' },
      ];

      const result = service.toCsv(data, columns);
      expect(result).toBe('Name,Points\nAlice,100\nBob,200');
    });

    it('should handle commas in values (quoting)', async () => {
      const data = [{ name: 'Doe, John', city: 'NYC' }];
      const columns = [
        { key: 'name' as keyof typeof data[0], label: 'Name' },
        { key: 'city' as keyof typeof data[0], label: 'City' },
      ];

      const result = service.toCsv(data, columns);
      expect(result).toBe('Name,City\n"Doe, John",NYC');
    });
  });

  describe('toJson', () => {
    it('should convert data to JSON string', async () => {
      const data = { id: 1, name: 'Test' };
      const result = service.toJson(data);
      expect(result).toBe(JSON.stringify(data, null, 2));
    });
  });
});
