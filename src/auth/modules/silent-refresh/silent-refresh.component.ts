import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/services/auth.service';
import { HttpService } from 'src/shared/services/http.service';
import { MaxHealthSnackBarService } from 'src/shared/ui/snack-bar'; 
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'auth-silent-refresh',
  templateUrl: './silent-refresh.component.html',
  styleUrls: ['./silent-refresh.component.scss']
})
export class SilentRefreshComponent implements OnInit {

  constructor(public auth:AuthService, public http:HttpService, private snackbar: MaxHealthSnackBarService) { }

  ngOnInit(): void {
    this.auth.completeSilentRefresh().then((value)=>{
        this.auth.setToken(value);

    }).catch((error)=>{
       console.log(error);
       window.location.reload();
    });

  }

}
