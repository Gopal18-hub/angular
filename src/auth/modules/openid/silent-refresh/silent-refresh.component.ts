import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { HttpService } from '../../../../shared/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'auth-silent-refresh',
  templateUrl: './silent-refresh.component.html',
  styleUrls: ['./silent-refresh.component.scss']
})
export class SilentRefreshComponent implements OnInit {

  constructor(public auth:AuthService, public http:HttpService) { }

  ngOnInit(): void {
    this.auth.completeSilentRefresh().then((value)=>{
        this.auth.setToken(value);

    }).catch((error)=>{
       console.log(error);
       window.location.reload();
    });

  }

}
