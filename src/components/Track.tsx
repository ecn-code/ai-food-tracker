export type TRACK_TYPE = { id: string, date: Date | null, name: string };

export default function Track({ track }: { track: TRACK_TYPE }) {
    return (
        <span>{track.id}</span>
    );
}
