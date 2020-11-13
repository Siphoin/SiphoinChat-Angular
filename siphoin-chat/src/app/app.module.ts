import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { UserItemComponent } from './user-item/user-item.component';
import { SignComponent } from './sign/sign.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatMessageComponent } from './chat-message/chat-message.component';
// определение маршрутов
const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'sign', component: SignComponent},
  { path: 'chat', component: ChatComponent},
  { path: '**', component: HomeComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
    UserItemComponent,
    SignComponent,
    ChatMessageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
