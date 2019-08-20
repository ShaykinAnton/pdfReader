import { MyPopoverComponent } from './../my-popover/my-popover.component';
import { MenuController } from '@ionic/angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { SimplePdfViewerComponent, SimpleSearchOptions } from 'simple-pdf-viewer';
import { PopoverController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

const zoomScale = 0.2;

const MAX_PAGES_SHOW = 20;
const QUALITY_SCREENSHOT_PREVIEW = 0.3;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {
  constructor(public menuCtrl: MenuController, public popoverController: PopoverController, private keyboard: Keyboard) {

  }
  maxPages: number;
  pg = 1;
  zm = 1.0;
  public progress = 0;
  showed = true;

  yourArray = [];
  pics = [];
  slides = [];

  curFile;
  @ViewChild(SimplePdfViewerComponent, null) private pdfViewer: SimplePdfViewerComponent;
  @ViewChild('fileUpload', { static: false }) private fileUploader: ElementRef;

  // Interval function
  protected interval: any;

  onPress($event) {
    this.interval = setInterval(_ => {
      this.progress = this.progress + 1;
    }, 50);
  }

  onPressUp($event) {
    clearInterval(this.interval);
    if (this.progress > 3) {
      this.openPopup($event);
    }
    this.progress = 0;
  }


  afterLoadComplete(pdfData: any) {
    this.maxPages = this.pdfViewer.getNumberOfPages();
    document.querySelector('#maxpage').innerHTML = '/' + this.maxPages;

    setTimeout(_ => {
      const outline = this.pdfViewer.getOutline();


      outline.forEach(element => {

        this.yourArray.push({
          title: element.title,
          dest: element.dest
        });
      });

    }, 1000);
    this.pdfViewer.zoomPageWidth();

    const max = this.maxPages <= MAX_PAGES_SHOW ? this.maxPages : MAX_PAGES_SHOW;

    this.getScreenShots(1, max).then((globalData) => {
      this.pics = globalData;
    });
  }

  onProgressed(data: any) {
    alert('onProgress');
  }

  openFile() {
    (this.fileUploader.nativeElement as Element).setAttribute('hidden', 'true');

    const file: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfViewer.openDocument(new Uint8Array(e.target.result));

      };
      this.curFile = file.files[0];
      reader.readAsArrayBuffer(file.files[0]);
      document.querySelector('#title').innerHTML = file.files[0].name;

    }
  }

  next() { this.pg++; this.pdfViewer.nextPage(); }
  prev() { this.pg--; this.pdfViewer.prevPage(); }

  setpg(num: number) {
    if (this.menuCtrl.isOpen()) { this.menuCtrl.close(); }
    if (num > this.maxPages) {
      this.pg = this.maxPages;
    } else if (num <= 1) {
      this.pg = 1;
    } else { this.pg = num; }
    this.pdfViewer.navigateToPage(num);
    this.keyboard.hide();

  }
  search(stringToSearch: string) {
    this.pdfViewer.search(stringToSearch, { phraseSearch: false, caseSensitive: true, highlightAll: true });
  }

  zoomIn() {
    this.zm += zoomScale;
  }
  zoomOut() {
    if (this.zm > 1.0) {
      this.zm -= zoomScale;
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

  openTableOfContents() {
    if (this.menuCtrl.isOpen()) { this.menuCtrl.close(); }
    this.menuCtrl.enable(true, 'mymenu');
    this.menuCtrl.open('mymenu');
  }
  openPreview() {
    if (this.menuCtrl.isOpen()) { this.menuCtrl.close(); }
    this.menuCtrl.enable(true, 'mymenu2');
    this.menuCtrl.open('mymenu2');
  }

  swipeIt() { alert('swiped'); }

  navTo(toNav: any) {
    this.pdfViewer.navigateToChapter(toNav);
    this.menuCtrl.close();
  }

  searchToggle() {
    if (this.showed) {
      document.querySelector('#searchBar').removeAttribute('hidden');
      document.querySelector('#title').setAttribute('hidden', 'true');
      (document.querySelector('#searchIcon') as HTMLIonIconElement).name = 'close';
    } else {
      document.querySelector('#title').removeAttribute('hidden');
      document.querySelector('#searchBar').setAttribute('hidden', 'true');
      (document.querySelector('#searchIcon') as HTMLIonIconElement).name = 'search';
    }
    this.showed = !this.showed;
  }
  async openPopup(ev) {
    const cent = ev.center;

    const popover = await this.popoverController.create({
      component: MyPopoverComponent,
      componentProps: {
        curFile: this.curFile
      },
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  showNext() {
  }

  createbookmark() {
    this.pdfViewer.createBookmark();
  }
  closeDocument() {
    this.pdfViewer.openDocument('');
    (this.fileUploader.nativeElement as Element).removeAttribute('hidden');
    this.pics = [];
    this.curFile = [];
    this.maxPages = 1;
    this.slides = [];
    this.yourArray = [];
  }

  async getScreenShots(i: number = 1, max: number = 10) {
    const globalData: { src: string; text: string; }[][] = [];
    for (i = 1; i <= max; i ++) {
      const data: { src: string, text: string }[] = [];
      await this.pdfViewer.getPageSnapshot(i, QUALITY_SCREENSHOT_PREVIEW).then((file) => {
        data.push({ src: file, text: i.toString() });
        if (i === max) {
          data.push({ src: '', text: '' });
          globalData.push(data);
        }
      });
      if (i !== max) {
        await this.pdfViewer.getPageSnapshot(i + 1, QUALITY_SCREENSHOT_PREVIEW).then( (file) => {
          data.push({ src: file, text: (++i).toString() });
          globalData.push(data);
        });
      }
      // this.pdfViewer.getPageSnapshot(i, 1).then(file => { this.slides.push(file); });
    }
    return globalData;
  }
  sendForm(element) {
    this.setpg(element.value);
    element.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
    setTimeout(() => {
        element.blur();  // actually close the keyboard
        // Remove readonly attribute after keyboard is hidden.
        element.removeAttribute('readonly');
    }, 100);
  }
}
