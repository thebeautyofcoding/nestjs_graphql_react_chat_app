import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatroomService } from './live-chatroom.service';

describe('LiveChatroomService', () => {
  let service: LiveChatroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveChatroomService],
    }).compile();

    service = module.get<LiveChatroomService>(LiveChatroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
