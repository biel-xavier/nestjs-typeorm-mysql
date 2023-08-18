import { Test, TestingModule } from "@nestjs/testing"
import { FileService } from "./file.service"
import { ExpressAdapter } from "@nestjs/platform-express";
import { getPhoto } from "../testing/photo.mock";

describe('FileService', () => {
    let fileService: FileService;    
    beforeEach( async ()=> {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileService,
            ]
        }).compile();

        fileService = module.get<FileService>(FileService);

        
       
    })

    test('Validar a definição', () => {
        expect(FileService).toBeDefined();
    })

    describe('Upload', () => {
        test('Method upload', async () => {
            const photo = await getPhoto();
            const filename = 'photo-test.png'
            fileService.upload(photo, filename);
        })
    })
})