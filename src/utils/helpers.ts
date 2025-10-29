import { BadRequestException } from "@nestjs/common";

export class Helper {
  static formatDates = (obj: any): any => {
    if(obj === null || obj === undefined) {
      return obj;
    }
    if(obj instanceof Date) {
      return obj.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false
      }).split(' ')[1];
    }
    if(Array.isArray(obj)) {
      return obj.map(item => this.formatDates(item))
    }
    if(typeof obj === 'object') {
      const formatted = {};
      for (const key in obj) {
        formatted[key] = this.formatDates(obj[key])
      }
      return formatted;
    }
    return obj;
  }
}

export default Helper;