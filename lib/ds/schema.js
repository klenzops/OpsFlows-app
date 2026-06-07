// lib/ds/schema.js
// What Reducto extracts from a DS (Declarations by the Seller of the Immovable) document

export const DS_SYSTEM_PROMPT = `You are extracting structured data from a Quebec OACIQ mandatory form — Declarations by the seller of the immovable (DS), for a chiefly residential immovable containing less than 5 dwellings excluding divided co-ownership.

Rules you must follow without exception:
- Extract data ONLY from fields that are visibly filled in. Never infer, assume, or guess blank fields.
- For signature fields, return true only if a visible handwritten signature or ink mark is present. A printed name is not a signature.
- For yes/no or checkbox questions, return the option that is checked or circled. If neither is selected, return null.
- The DS contract number appears in the bottom right corner of every page starting with DS.
- For declaration sections, if a question is answered "Yes" or "No", return that text exactly.
- For free-form text fields (explanations, descriptions), extract the written text verbatim.
- Do not add commentary, explanations, or fields not in the schema.`

export const DS_SCHEMA = {
  type: "object",
  properties: {
    "DS contract number": {
      type: "string",
      description: "The DS reference number printed in the bottom right corner of every page. Format: DS followed by digits e.g. DS-00001."
    },
    "Property Address": {
      type: "string",
      description: "Full civic address of the immovable being declared."
    },
    "Sellers": {
      type: "array",
      description: "All sellers who signed this declaration form.",
      items: {
        type: "object",
        properties: {
          "Full Name": { type: "string" }
        }
      }
    },

    // Section A: General information
    "A1 Number of dwellings": {
      type: "string",
      description: "Section A1: Number of dwellings in the immovable."
    },
    "A2 Year of construction": {
      type: "string",
      description: "Section A2: Approximate year of construction of the building."
    },
    "A3 Municipal assessment": {
      type: "string",
      description: "Section A3: Most recent municipal assessment value."
    },
    "A4 Lot area": {
      type: "string",
      description: "Section A4: Lot area in square metres or square feet."
    },

    // Section B: Building components
    "B1 Roof covering type": {
      type: "string",
      description: "Section B1: Type of roof covering (e.g. asphalt shingles, metal)."
    },
    "B1 Roof covering age": {
      type: "string",
      description: "Section B1: Age or year of installation of the roof covering."
    },
    "B2 Foundation type": {
      type: "string",
      description: "Section B2: Type of foundation (e.g. concrete, stone, block)."
    },
    "B3 Exterior cladding": {
      type: "string",
      description: "Section B3: Type of exterior cladding (e.g. brick, vinyl, wood)."
    },
    "B4 Heating system type": {
      type: "string",
      description: "Section B4: Type of heating system (e.g. forced air, electric baseboards)."
    },
    "B4 Heating system energy source": {
      type: "string",
      description: "Section B4: Energy source for the heating system (e.g. natural gas, electricity, oil)."
    },
    "B5 Air conditioning": {
      type: "string",
      description: "Section B5: Yes or No — presence of air conditioning system."
    },
    "B6 Electrical panel amperage": {
      type: "string",
      description: "Section B6: Amperage of the electrical panel (e.g. 100A, 200A)."
    },
    "B6 Electrical panel type": {
      type: "string",
      description: "Section B6: Type of electrical panel (e.g. circuit breakers, fuses)."
    },
    "B7 Plumbing": {
      type: "string",
      description: "Section B7: Type of plumbing pipes (e.g. copper, PVC, lead, galvanised)."
    },
    "B8 Sewage system": {
      type: "string",
      description: "Section B8: Type of sewage system (e.g. municipal, septic tank, cesspool)."
    },
    "B9 Water supply": {
      type: "string",
      description: "Section B9: Water supply source (e.g. municipal aqueduct, artesian well, surface well)."
    },

    // Section C: Known defects and conditions
    "C1 Water infiltration": {
      type: "string",
      description: "Section C: Yes or No — seller knowledge of any water infiltration in basement, walls or roof."
    },
    "C1 Water infiltration details": {
      type: "string",
      description: "If C1 is Yes, any explanatory text provided by the seller."
    },
    "C2 Foundation problems": {
      type: "string",
      description: "Section C: Yes or No — seller knowledge of cracks, settlement, or movement in the foundation."
    },
    "C2 Foundation problems details": {
      type: "string",
      description: "If C2 is Yes, any explanatory text."
    },
    "C3 Roof problems": {
      type: "string",
      description: "Section C: Yes or No — seller knowledge of current or past roof leaks or damage."
    },
    "C3 Roof problems details": {
      type: "string",
      description: "If C3 is Yes, any explanatory text."
    },
    "C4 Pyrite or expansive soil": {
      type: "string",
      description: "Section C: Yes or No — presence of pyrite or expansive soil under the building or lot."
    },
    "C4 Pyrite or expansive soil details": {
      type: "string",
      description: "If C4 is Yes, any explanatory text."
    },
    "C5 Mould or air quality": {
      type: "string",
      description: "Section C: Yes or No — mould, fungus, or indoor air quality problems."
    },
    "C5 Mould or air quality details": {
      type: "string",
      description: "If C5 is Yes, any explanatory text."
    },
    "C6 Vermiculite insulation": {
      type: "string",
      description: "Section C: Yes or No — building contains vermiculite insulation."
    },
    "C6 Vermiculite insulation details": {
      type: "string",
      description: "If C6 is Yes, any explanatory text."
    },
    "C7 Urea-formaldehyde foam insulation": {
      type: "string",
      description: "Section C: Yes or No — building contains urea-formaldehyde foam insulation (UFFI)."
    },
    "C8 Underground storage tank": {
      type: "string",
      description: "Section C: Yes or No — underground fuel storage tank (current or former) on the lot."
    },
    "C8 Underground storage tank details": {
      type: "string",
      description: "If C8 is Yes, any explanatory text."
    },
    "C9 Oil burner or fuel heating": {
      type: "string",
      description: "Section C: Yes or No — building uses or used an oil burner or fuel-based heating system."
    },
    "C10 Major work done": {
      type: "string",
      description: "Section C: Yes or No — major work done on the building in the last 10 years."
    },
    "C10 Major work done details": {
      type: "string",
      description: "If C10 is Yes, description of the work done."
    },
    "C11 Work without permit": {
      type: "string",
      description: "Section C: Yes or No — work done without a required municipal permit."
    },
    "C11 Work without permit details": {
      type: "string",
      description: "If C11 is Yes, any explanatory text."
    },

    // Section D: Legal situation
    "D1 Pre-emptive right": {
      type: "string",
      description: "Section D: Yes or No — pre-emptive right or right of first refusal on the property."
    },
    "D1 Pre-emptive right details": {
      type: "string",
      description: "If D1 is Yes, any explanatory text."
    },
    "D2 Disputes or litigation": {
      type: "string",
      description: "Section D: Yes or No — current or pending disputes, lawsuits, or claims involving the property."
    },
    "D2 Disputes or litigation details": {
      type: "string",
      description: "If D2 is Yes, any explanatory text."
    },
    "D3 Expropriation notice": {
      type: "string",
      description: "Section D: Yes or No — notice of expropriation received or anticipated."
    },
    "D4 Easements or real rights": {
      type: "string",
      description: "Section D: Yes or No — easements, servitudes, or real rights affecting the property beyond those in the title."
    },
    "D4 Easements or real rights details": {
      type: "string",
      description: "If D4 is Yes, any explanatory text."
    },
    "D5 Zoning or by-law violations": {
      type: "string",
      description: "Section D: Yes or No — violation of municipal zoning or by-law applicable to the property."
    },
    "D5 Zoning or by-law violations details": {
      type: "string",
      description: "If D5 is Yes, any explanatory text."
    },

    // Signatures
    "Signature Part - Seller(s)": {
      type: "array",
      description: "Signature section for each seller on the DS form.",
      items: {
        type: "object",
        properties: {
          "Signature present":       { type: "boolean", description: "True only if a handwritten signature is visible." },
          "Signature date and time": { type: "string",  description: "Date written next to the signature." },
          "Signature location":      { type: "string",  description: "City or location written next to the signature." }
        }
      }
    }
  }
}
