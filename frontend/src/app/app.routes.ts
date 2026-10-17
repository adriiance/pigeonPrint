import { Routes } from '@angular/router';
import { Login } from '../komponente/login/login';
import { Fizickolice } from '../komponente/fizickolice/fizickolice';
import { Pravnolice } from '../komponente/pravnolice/pravnolice';
import { Admin } from '../komponente/admin/admin';
import { Loginadmin } from '../komponente/loginadmin/loginadmin';
import { Registracija } from '../komponente/registracija/registracija';
import { Stampar } from '../komponente/stampar/stampar';
import { Pocetna } from '../komponente/pocetna/pocetna';
import { Detalji } from '../komponente/detalji/detalji';
import { Detaljiprosireno } from '../komponente/detaljiprosireno/detaljiprosireno';
import { Kupovina } from '../komponente/kupovina/kupovina';
import { Korpa } from '../komponente/korpa/korpa';
import { Noviproizvod } from '../komponente/noviproizvod/noviproizvod';

export const routes: Routes = [
  {path: "login", component: Login},
    {path: "fizickolice", component: Fizickolice},
    {path: "pravnolice", component: Pravnolice},
    {path: "stampar", component: Stampar},
    {path: "admin", component: Admin},
    {path: "adminLogin", component: Loginadmin},
    {path: "registracija", component: Registracija},
    {path: "", component: Pocetna},
    {path: "pocetna", component: Pocetna},
    {path: "detalji", component: Detalji},
    {path: "detaljiProsireno", component: Detaljiprosireno},
    {path: "kupovina", component: Kupovina},
    {path: "korpa", component: Korpa},
    {path:"noviProizvod", component:Noviproizvod}
];
