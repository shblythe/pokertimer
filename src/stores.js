import { writable, derived } from 'svelte/store';

// const interval_time_s = 60 * 20;
const interval_time_s = 40;

const running = writable(false);

export const clock_running = derived(
    running,
    $running => $running
);

const create_time_clock = () => {
    const { subscribe, set, update } = writable(new Date());

    return {
        subscribe,
        tick: () => set(new Date())
    }
}

const time_clock = create_time_clock();

const create_poker_clock = () => {
    const { subscribe, set, update } = writable(0);

    return {
        subscribe,
        start: () => {
            set(new Date());
            running.set(true);
        },
        stop: () => {
            running.set(false);
        },
        tick: () => time_clock.tick()
    };
};

export const poker_clock = create_poker_clock();

const elapsed_time = derived(
    [poker_clock, time_clock],
    ([$poker_clock, $time_clock]) => Math.trunc(($time_clock-$poker_clock)/1000)
);

const cycle_time_remaining = derived(
    elapsed_time,
    ($elapsed_time) => (interval_time_s - ($elapsed_time % interval_time_s) - 1)
);

export const countdown = derived(
    [cycle_time_remaining, running],
    ([$cycle_time_remaining, $running]) => {
        if (!$running) {
            return "--:--";
        }
        let seconds = $cycle_time_remaining;
        return (Math.trunc(seconds / 60)).toString().padStart(2,"0") + ":" + (seconds % 60).toString().padStart(2,"0");
    }
);

export const flash = derived(
    [cycle_time_remaining, running],
    ([$cycle_time_remaining, $running]) => {
        return ($running && $cycle_time_remaining < 30 && $cycle_time_remaining % 2 == 1);
    }
);

const cycle_count = derived(
    elapsed_time,
    ($elapsed_time) => Math.trunc($elapsed_time / interval_time_s)
);

export const small_blind = derived(
    [cycle_count, running],
    ([$cycle_count, $running]) => ($running ? (25 * Math.pow(2, $cycle_count)) : 25)
);

export const big_blind = derived(
    small_blind,
    ($small_blind) => 2 * $small_blind
);

