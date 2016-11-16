import { Component, OnInit } from '@angular/core';
import { PrimusService } from '../shared/primus.service';

@Component({
  selector: 'my-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private primus: PrimusService) {}

  ngOnInit() {
    this.primus.initSocket();
    this.primus.requestMap();
  }

}
