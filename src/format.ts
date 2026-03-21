export class FormatUtils {
    static numberWithCommas(x: string | number) {
      if (x && !isNaN(x)) {
        const valueString = x.toString();
        const [integerPart, ...decimalParts] = valueString.split('.');
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        if (decimalParts.length === 0) {
          return formattedIntegerPart;
        }

        return `${formattedIntegerPart}.${decimalParts.join('.')}`;
      }
    
      return x;
    }
}