import { SocketIoService } from './socket-io.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'socketio-angular';
  constructor() {}
  ngOnInit(): void {
  }
}
