import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../socket-io.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  constructor(private socketService: SocketIoService) { }

  ngOnInit(): void {
  }

  onSubmit($e: Event, name: string, room: string) {
    $e.preventDefault();
    if (name.trim() && room.trim()) {
    console.log(name);
    this.socketService.connectToServer(name, room);
    }

  }

  getStatusConnection() : boolean {
    return this.socketService.connected;
 }

}
