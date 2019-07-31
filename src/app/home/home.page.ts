import { Component, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {
  totalPages: number;
  isLoaded = false;
  pg = 1;
  zm = 1.0;
  showed = true;
  constructor() { }

  @ViewChild(PdfViewerComponent, null) private pdfComponent: PdfViewerComponent;
  cors = 'https://cors-anywhere.herokuapp.com/';
  pdfSrc = this.cors + 'http://www.pdf995.com/samples/pdf.pdf';

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  sel() {
      const $img: any = document.querySelector('#file');

      if (typeof (FileReader) !== 'undefined') {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.pdfSrc = e.target.result;
        };

        reader.readAsArrayBuffer($img.files[0]);
    }
  }

  next() { this.pg++; }
  prev() { this.pg--; }
  setpg(p: number) {
    this.pg = p;
  }
  search(stringToSearch: string) {
    this.pdfComponent.pdfFindController.executeCommand('find', {
      caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: stringToSearch
    });
  }

  zoomIn() {
    this.zm += 0.1;
  }
  zoomOut() {
    if (this.zm > 1.0) {
      this.zm -= 0.1;
    }
  }
  click() {
    if (this.showed) {
      const t = document.querySelectorAll('.fab');
      t.forEach(element => {
        element.setAttribute('hidden', 'true');
      });
    } else {
      const t = document.querySelectorAll('.fab');
      t.forEach(element => {
        element.removeAttribute('hidden');
      });
    }
    window.getSelection().removeAllRanges();
    this.showed = !this.showed;
  }
}
