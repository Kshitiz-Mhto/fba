// Company Logos Components
const NotionLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-auto">
        <path d="M4.222 24C1.944 24 0 22.146 0 19.824V5.77C0 4.385 1.703 3.49 2.868 4.238l.685.42c1.78.966 4.382-.43 4.382-2.352V1.5A1.5 1.5 0 0 1 9.435 0h9.913c1.944 0 3.195 1.77 2.456 3.483l-1.077 2.41c-.698 1.442.36 3.09 1.94 3.09h.122c.706 0 1.211.66 1.211 1.34v9.913A3.945 3.945 0 0 1 20.06 24H4.222ZM5.48 10.373v9.09c0 .604.606 1.028 1.134.78l1.372-.635a.807.807 0 0 1 1.127.734v.04a.8.8 0 0 0 1.354.58l5.225-5.32a.81.81 0 0 0 .229-.567V5.77a.81.81 0 0 0-1.298-.646l-9.143 5.25Z" />
    </svg>
);

const LinearLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
        <path d="M10.45 22.89L1.13 13.57a1.69 1.69 0 0 1-.02-2.38l6.46-6.49a1.69 1.69 0 0 1 2.39-.02l9.33 9.32a1.69 1.69 0 0 1 .02 2.38l-6.47 6.49a1.69 1.69 0 0 1-2.39.02ZM22.86 8.35L13.54 18.27a1.69 1.69 0 0 1-2.38-.02l-.63-.63a1.69 1.69 0 0 1 .02-2.39l9.32-9.92a1.69 1.69 0 0 1 2.38.02l.63.63a1.69 1.69 0 0 1-.02 2.39Z" />
    </svg>
);

const VercelLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
    </svg>
);

const FramerLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-auto">
        <path d="M4 0h16v8h-8zM4 12h8v8zM4 24v-8h8l8-8V0H4z" />
    </svg>
);

const RaycastLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-auto">
        <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
    </svg>
);

const BuyMeACoffeeLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-auto">
        <path d="M20.216 6.415l-.132-.666c-.119-.596-.387-1.142-1.001-1.602C18.452 3.679 17.584 3.321 16.324 3.321h-9.65c-1.42 0-2.348.46-2.923 1.168C3.12 5.26 2.92 6.355 3.125 7.425l.849 4.316c.39 1.986 2.27 3.524 4.568 3.524h.168c1.32 2.652 3.82 4.303 7.025 4.303 3.655 0 6.64-2.146 7.62-5.466.19-.572.29-1.226.29-1.95 0-.46-.05-1.026-.145-1.626l-.422-2.13c-.342-1.742-1.85-3.078-3.662-3.078h.8c.84 0 1.2.65 1.2 1.32 0 .54-.23.95-.51 1.25-.43.46-1.17.65-2.06.65h-1.63L20.216 6.415z" />
    </svg>
);

export const Logos = {
    Notion: NotionLogo,
    Linear: LinearLogo,
    Vercel: VercelLogo,
    Framer: FramerLogo,
    Raycast: RaycastLogo,
    BuyMeACoffee: BuyMeACoffeeLogo,
} as const;