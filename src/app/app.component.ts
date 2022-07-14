import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as momentZone from 'moment-timezone';

export interface TZone {
  name: string;
  nameValue: string;
  timeValue: string;
  group: string;
  abbr: string;
}

export interface SelectConfig {
  appearance: 'underline' | 'outline';
  appendTo: string | null;
  clearOnBackspace: boolean;
  closeOnSelect: boolean;
  dropdownPosition: 'auto' | 'bottom' | 'top';
  hideSelected: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  getUserZone = true;
  customPlaceholderText = 'Choose...';
  customNotFoundText = 'No zone found';
  clearable = false;
  virtualScroll = true;
  disabled = false;
  timeZones: TZone[] = [];
  form: FormGroup;

  private _config: SelectConfig = {
    hideSelected: false,
    dropdownPosition: 'auto',
    appearance: 'underline',
    clearOnBackspace: true,
    closeOnSelect: true,
    appendTo: null,
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      timezone: [],
    });
  }

  ngOnInit() {
    this.timeZones = momentZone.tz
      .names()
      .map((zone: string) => this.formatZone(zone));
    console.log(this.timeZones);
  }

  ngAfterViewInit(): void {
    this.guessUserTimezone();
  }

  public formatZone(zone: string): TZone {
    const utc: string = momentZone.tz(zone).format('Z');
    const abbr: string = momentZone.tz(zone).zoneAbbr();
    return {
      name: `${zone} (${utc})`,
      nameValue: zone,
      timeValue: utc,
      group: zone.split('/', 1)[0],
      abbr: abbr,
    };
  }

  private guessUserTimezone(): void {
    if (this.getUserZone) {
      const guessedZone = momentZone.tz.guess(true);
      console.log(this.formatZone(guessedZone));
      // this.form.get('timeZone')?.setValue(this.formatZone(guessedZone));
    }
  }
}
