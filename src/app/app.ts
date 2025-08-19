import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CcpPanel } from './ccp-panel/ccp-panel';
import { CustomerProfile } from './customer-profile/customer-profile';
import { CasesPanel } from './cases-panel/cases-panel';
import { Header } from './header/header';
import { CustomAttributes } from './custom-attributes/custom-attributes';

@Component({
  selector: 'app-root',
  imports: [ CommonModule, CcpPanel, CustomerProfile, CasesPanel, Header, CustomAttributes],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Angular-Agent-Screen-SWA';
}
