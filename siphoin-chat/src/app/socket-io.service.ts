import { UserElement } from './user-element';
import { UserMessage } from './user-message';
import { Injectable } from '@angular/core';
import { socketSettings } from 'socket-manifest';
import * as io from 'socket.io-client';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  socket;

  nameRoom: string;
  nameUser: string;
  id: string;
  connected: boolean;

private  messages: UserMessage[] = [];
private users: UserElement[] = [];

  constructor(private router: Router) { }

  // tslint:disable-next-line: typedef
  connectToServer(name: string, room: string) {

    this.socket = io(socketSettings.SOCKET_ENDPOINT);
    this.nameUser = name;
    this.nameRoom = room;
    this.listenSocket();
  }

  // tslint:disable-next-line: typedef
  listenSocket() {

    this.socket.on('connect', () => {
      console.log('Connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('disconnect');
      this.id = null;
      this.nameRoom = null;
      this.nameUser = null;
      this.connected = false;
      this.messages = [];
      this.users = []
      this.socket.disconnect();
    });


    this.socket.on('get_id', (data) => {
        this.id = data.id;
    //    console.log(this.id);

        this.socket.emit('add_user', {
      name: this.nameUser
    });
      });

    this.socket.on('new_message', (data) => {
           let type: string = null;
           if (data.id === this.id) {
          type = 'out';
        } else {
          type = 'in';
        }
           let message: UserMessage = {
                name: data.name,
                messsage: data.message,
                type: type
              };

           this.messages.push(message);
           console.log('message geted: ', message);

      });

    this.socket.on('user_added', () => {
        console.log('Auth');
        this.socket.emit('join_room', {
          room: this.nameRoom
        });
      });

    this.socket.on('on_join_room', () => {

        console.log('joined on room');

        this.router.navigate(['/chat']);
      });

    this.socket.on('user_joined', (data) => {
         let user: UserElement = {
           name: data.name
         }

         this.users.push(user);
      });

    this.socket.on('user_leaved', (data) => {
        let name: string = data.name

        this.users = this.users.filter(val => val.name !== name);
        console.log("leave");
     });

  }

public getMessages () : UserMessage[] {
return this.messages;
 }

 public getUsers () : UserElement[] {
  return this.users;
   }


  sendMessage(msg: string): void {
this.socket.emit('send_message', {
  msg: msg,
  id: this.id,
  name: this.nameUser,
  room: this.nameRoom
})
  }

}
