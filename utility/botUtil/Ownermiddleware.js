const Ownermiddleware = async (context, next) => {
    const { m, Owner } = context;

    if (!Owner) {
        return m.reply(`◈━━━━━━━━━━━━━━━━◈
│❒ You dare attempt to use Owner command? 

│❒ Your mere existence is an insult to my code. 

│❒ Crawl back into the abyss where mediocrity thrives before I personally wipe you from this reality fool. 💀👿
◈━━━━━━━━━━━━━━━━◈
> ρσɯҽɾԃ Ⴆყ 𝙳𝙰𝚅𝙴-x𝙳 `);
    }

    await next();
};

module.exports = Ownermiddleware;
