import { UserElement } from './../user-element';
import { UserMessage } from './../user-message';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketIoService } from '../socket-io.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
messages: UserMessage[] = [

];

users: UserElement[] = [

];

  constructor(private router: Router, private socketService: SocketIoService) { }

  ngOnInit(): void {
    this.checkConnection();
    setInterval(() => {
      this.checkConnection();
    }, 1000);
    this.getMessages();
    this.getUsers();
  }


  // tslint:disable-next-line: typedef
  private checkConnection() {
    if (!this.socketService.connected) {
      this.router.navigate(['/sign']);
    }
  }

  getMessages(): void {
    setInterval(() => {
      this.messages = this.socketService.getMessages();
    }, 1000);


  }

  getUsers(): void {
    setInterval(() => {
      this.users = this.socketService.getUsers();
    }, 1000);


  }

  sendMessage (pole, message: string): void {
    pole.value = '';
    this.socketService.sendMessage(message);
  }

}
