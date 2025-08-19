import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcpEventsService } from '../services/ccp-events.service';
declare var bootstrap: any;

@Component({
  selector: 'cases-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cases-panel.html',
  styleUrls: ['./cases-panel.scss'],
})
export class CasesPanel {
  private ccpEvents = inject(CcpEventsService);
  selectedCase: any = null;
  isExpanded = true;
  cases: any[] = [];

  ngOnInit() {
    this.ccpEvents.passingDataFromCustomerProfileToCases$.subscribe((data) => {
      if (
        data === null ||
        data === '' ||
        (Array.isArray(data) && data.length === 0)
      ) {
        this.cases = [];
      }
      console.log('Received data for cases:', data);
      this.cases = this.formatCases(data?.data);
    });
  }

 

  toggleAttributes() {
    this.isExpanded = !this.isExpanded;
  }

  openCaseDetails(caseItem: any) {
    this.selectedCase = caseItem;
    const modalEl = document.getElementById('caseDetailsModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  formatCases(apiResponse: any[]){
    return apiResponse?.map((caseItem: any) => {
      const caseObj: any = {};

      caseItem.fields.forEach((field: any) => {
        const value =
          field.value?.stringValue ||
          field.value?.userArnValue ||
          field.value?.doubleValue ||
          null;

        switch (field.id) {
          case 'status':
            caseObj.status = value;
            break;
          case 'reference_number':
            caseObj.referenceId = value;
            break;
          case 'title':
            caseObj.title = value;
            break;
          case 'last_updated_datetime':
            caseObj.lastUpdated = value;
            break;
          case 'summary':
            caseObj.description = value;
            break;
          case 'customer_id':
            caseObj.customerId = value;
            break;
          case 'assigned_user':
            caseObj.assignedUser = value;
            break;
          case 'case_reason':
            caseObj.reason = value;
            break;
          default:
            caseObj[field.id] = value;
        }
      });

      return caseObj;
    });
  }
}
