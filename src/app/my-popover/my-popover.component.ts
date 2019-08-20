import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-my-popover',
  templateUrl: './my-popover.component.html',
  styleUrls: ['./my-popover.component.scss'],
})
export class MyPopoverComponent implements OnInit {

  text = 'TEXT!';
  curFile: any;
  constructor(public popoverController: PopoverController, private socialSharing: SocialSharing,
              private navParams: NavParams) { }

  ngOnInit() { this.curFile = this.navParams.data.curFile; }

  close() {
    this.popoverController.dismiss();
  }

  async shareEmail() {
    this.socialSharing.shareViaEmail(this.text, 'My custom subject', ['saimon@devdactic.com'], null, null,
      this.curFile.nativeURL).then(() => {

      }).catch((e) => {
        // Error!
      });
  }

  async shareFacebook() {

    // Image or URL works
    this.socialSharing.shareViaFacebook(null, this.curFile.nativeURL, null).then(() => {
    }).catch((e) => {
      // Error!
    });
  }
  async shareTwitter() {
    // Either URL or Image
    this.socialSharing.shareViaTwitter(null, null, this.curFile.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async shareWhatsApp() {
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, null, this.curFile.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }


}
