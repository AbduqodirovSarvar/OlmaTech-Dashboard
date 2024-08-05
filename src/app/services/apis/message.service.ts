import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ConfigService } from './config.service';

export interface MessageResponse {
  id: string;
  email: string;
  name: string;
  subject: string;
  text: string;
  isSeen: boolean;
  isReplied: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface UpdateMessageRequest {
  id: string;
  email?: string;
  name?: string;
  subject?: string;
  text?: string;
  isSeen?: boolean;
  isReplied?: boolean;
}

export interface DeleteMessageRequest {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseMessageUrl: string;
  public IsSeenBehaviourSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseMessageUrl = this.config.getBaseApiUrl() + '/Message';
  }

  getMessageById(id: string): Observable<MessageResponse> {
    const params = new HttpParams().set('Id', id);
    return this.http.get<MessageResponse>(`${this.baseMessageUrl}`, { params });
  }

  updateMessage(updateCommand: UpdateMessageRequest): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.baseMessageUrl}`, updateCommand );
  }

  deleteMessage(deleteCommand: DeleteMessageRequest): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseMessageUrl}`, { body: deleteCommand });
  }

  getAllMessages(): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.baseMessageUrl}/all`).pipe(
      tap((response: MessageResponse[]) => {
        const isSeenCount = response.filter(message => !message.isSeen).length;
        this.IsSeenBehaviourSubject.next(isSeenCount > 0 ? isSeenCount : null);
      })
    );
  }
}
