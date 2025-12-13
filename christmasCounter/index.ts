import { definePluginSettings } from "@api/Settings";
import { Devs, EquicordDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { Toasts } from "@webpack/common";

const settings = definePluginSettings({
    christmasDay: {
        description: "Day to count towards (24 or 25)",
        type: OptionType.SELECT,
        options: [
            { label: "December 24", value: 24 },
            { label: "December 25", value: 25, default: true }
        ]
    }
});

const getDaysToChristmas = () => {
    const now = new Date();
    const targetDay = settings.store.christmasDay ?? 24;

    let christmas = new Date(now.getFullYear(), 11, targetDay);

    if (now > christmas) {
        christmas.setFullYear(now.getFullYear() + 1);
    }

    const difference = christmas.getTime() - now.getTime();
    return Math.floor(difference / (1000 * 60 * 60 * 24));
};

let lastShownDate: string | null = null;

export default definePlugin({
    name: "Christmas Counter",
    description: "Displays a countdown to Christmas every day.",
    authors: [{ name: "Vaiskiainen", id: 1205851726586970125n }],
    settings,

    start() {
        const now = new Date();
        const currentDate = now.toISOString().slice(0, 10);

        if (lastShownDate !== currentDate) {
            const days = getDaysToChristmas();
            Toasts.show({
                id: "equicord-christmas-counter",
                type: Toasts.Type.MESSAGE,
                message: `Only ${days} days until Christmas${(settings.store.christmasDay ?? 24) === 25 ? " Day" : " Eve"}! 🎁`
            });
            lastShownDate = currentDate;
        }
    }
});
