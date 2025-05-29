import { Tag } from "../models/Tag.js";
import { Breed } from "../models/Breed.js";
import { Server } from "../models/Server.js";

async function seeding() {
    Tag.bulkCreate([
        { name: "XP", color: "#3498db"},
        { name: "Donjon", color: "#c0392b"},
        { name: "Drop", color: "#16a085"},
        { name: "Quête", color: "#9b59b6"},
        { name: "AVA", color: "#f39c12"},
        { name: "Percepteur", color: "#2c3e50"},
        { name: "Kolizéum", color: "#f1c40f"},
    ],
    { 
        ignoreDuplicates: true 
    });

    Breed.bulkCreate([
        { name: "Cra" },
        { name: "Ecaflip" },
        { name: "Eliotrope" },
        { name: "Enirispa" },
        { name: "Enutrof"},
        { name: "Feca" },
        { name: "Forgelance" },
        { name: "Huppermage" },
        { name: "Iop"},
        { name: "Osamodas"},
        { name: "Ouginak"},
        { name: "Pandawa"},
        { name: "Roublard"},
        { name: "Sacrieur"},
        { name: "Sadida"},
        { name: "Sram"},
        { name: "Steamer"},
        { name: "Xélor"},
        { name: "Zobal"}
    ], 
    { 
        ignoreDuplicates: true 
    });

    Server.bulkCreate([
        { name: "Dakal", mono_account: true },
        { name: "Draconiros", mono_account: true },
        { name: "Kourial", mono_account: true },
        { name: "Mikhal", mono_account: true },
        { name: "Brial", mono_account: false },
        { name: "HellMina", mono_account: false },
        { name: "Imagiro", mono_account: false },
        { name: "Orukam", mono_account: false },
        { name: "Rafal", mono_account: false },
        { name: "Salar", mono_account: false },
        { name: "TalKasha", mono_account: false },
        { name: "Tylezia", mono_account: false },
        { name: "Ombre", mono_account: false }
    ],
    { 
        ignoreDuplicates: true 
    });
};

export { seeding };