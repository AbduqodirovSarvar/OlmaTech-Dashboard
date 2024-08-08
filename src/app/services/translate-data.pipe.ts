import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'translateData',
  standalone: true
})
export class TranslateDataPipe implements PipeTransform {
  languageCode: string;

  constructor(private helperService: HelperService) {
    this.languageCode = this.helperService.getLanguageCode();
  }
  transform(value: string): Observable<string> {


    // return "test";
    throw new Error();
  }

}
