export class FormatUtils {
    static numberWithCommas(x: string | number) {
      if (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    
      return x;
    }
}