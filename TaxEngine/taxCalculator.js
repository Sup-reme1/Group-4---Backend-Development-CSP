
const TaxService = {
    TAX_BANDS: [
            { limit: 800000, rate: 0.00 },    // First 800k (Tax-Free)
            { limit: 3000000, rate: 0.15 },   // Next 2.2M (Total 3M)
            { limit: 12000000, rate: 0.18 },  // Next 9M (Total 12M)
            { limit: 25000000, rate: 0.21 },  // Next 13M (Total 25M)
            { limit: 50000000, rate: 0.23 },  // Next 25M (Total 50M)
            { limit: Infinity, rate: 0.25 }   // Above 50M
        ],

    calculatePension (grossIncome) {
        return (grossIncome) * 0.08;
    },

    calculateNHF (grossIncome) {
        return (grossIncome) * 0.025;
    },

    calculateRentRelief (actualRent) {
        const calculatedRelief = actualRent * 0.20;
        return Math.min(calculatedRelief, 500000);
    },

    /** Main Engine Logic */
    calculateAnnualTax (params) {
        const { 
            grossIncome, actualRent, otherDeductions = 0 
        } = params;

        // 1. Calculate Statutory Deductions
        var pension = this.calculatePension(grossIncome);
        var nhf = this.calculateNHF(grossIncome);
        var rentRelief;
        if (actualRent){
            rentRelief = this.calculateRentRelief(actualRent);
        }else{
            rentRelief = 0;
        }

        // 2. Determine Taxable Income
        var totalReliefs = pension + nhf + rentRelief + otherDeductions;
        var taxableIncome = Math.max(0, grossIncome - totalReliefs);

        // 3. Progressive Calculation (The "Bucket" Logic)
        let taxPayable = 0;
        let previousLimit = 0;

        for (const band of this.TAX_BANDS) {
            if (taxableIncome > previousLimit) {
                const taxableInThisBand = Math.min(taxableIncome, band.limit) - previousLimit;
                taxPayable += taxableInThisBand * band.rate;
                previousLimit = band.limit;
            } else {
                break;
            }
        }

        return {
            pensionRelief: pension,
            NHFRelief: nhf,
            rentRelief: (rentRelief !== "") ? rentRelief : "",
            totalReliefs,
            taxableIncome: Number(taxableIncome.toFixed(2)),
            annualTax: Number(taxPayable.toFixed(2)),
            monthlyTax: Number((taxPayable / 12).toFixed(2))
        };
    }
}



// --- Usage Example ---
const engine = TaxService;
const result = engine.calculateAnnualTax({
    grossIncome: 60000000,
    actualRent: 4000000
});

console.log(result);
