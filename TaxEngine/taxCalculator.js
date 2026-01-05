
const TaxService = {
    TAX_BANDS: [
            { limit: 800000, rate: 0.00 },    // First 800k (Tax-Free)
            { limit: 3000000, rate: 0.15 },   // Next 2.2M (Total 3M)
            { limit: 12000000, rate: 0.18 },  // Next 9M (Total 12M)
            { limit: 25000000, rate: 0.21 },  // Next 13M (Total 25M)
            { limit: 50000000, rate: 0.23 },  // Next 25M (Total 50M)
            { limit: Infinity, rate: 0.25 }   // Above 50M
        ],

    /** Mandatory 8% of Basic + Housing + Transport */
    calculatePension (basic, housing, transport) {
        return (basic + housing + transport) * 0.08;
    },

    /** New 2026 Rule: Lower of 20% of rent or 500k cap */
    calculateRentRelief (actualRent) {
        const calculatedRelief = actualRent * 0.20;
        return Math.min(calculatedRelief, 500000);
    },
    /** Main Engine Logic */
    calculateAnnualTax (params) {
        const { 
            grossIncome, basic, housing, 
            transport, actualRent, otherDeductions = 0 
        } = params;

        // 1. Calculate Statutory Deductions
        const pension = this.calculatePension(basic, housing, transport);
        const nhf = basic * 0.025; // 2.5% of Basic

        // 2. Apply Rent Relief
        const rentRelief = this.calculateRentRelief(actualRent);

        // 3. Determine Taxable Income
        const totalReliefs = pension + nhf + rentRelief + otherDeductions;
        const taxableIncome = Math.max(0, grossIncome - totalReliefs);

        // 4. Progressive Calculation (The "Bucket" Logic)
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
            taxableIncome: Number(taxableIncome.toFixed(2)),
            annualTax: Number(taxPayable.toFixed(2)),
            monthlyTax: Number((taxPayable / 12).toFixed(2))
        };
    }
}






// --- Usage Example ---
const engine = TaxService;
const result = engine.calculateAnnualTax({
    grossIncome: 12000000,
    basic: 6000000,
    housing: 3000000,
    transport: 2000000,
    actualRent: 2000000
});

console.log(`Monthly PAYE: ₦${result.monthlyTax.toLocaleString()}`);