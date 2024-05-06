import { writable, derived, get } from 'svelte/store';

// const interval_time_s = 60 * 20;
const interval_time_s = 40;

const running = writable(localStorage.getItem("running")==="true"?true:false);
running.subscribe(value => {localStorage.setItem("running", value)});
export const paused = writable(localStorage.getItem("paused")==="true"?true:false);
paused.subscribe(value => {localStorage.setItem("paused", value)});

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

const paused_at = writable(new Date(localStorage.getItem("paused_at")));
paused_at.subscribe(value => {localStorage.setItem("paused_at", value)});

const create_poker_clock = () => {
    const { subscribe, set, update } = writable(new Date(localStorage.getItem("poker_clock")));

    return {
        subscribe,
        start: () => {
            set(new Date());
            running.set(true);
            paused.set(false);
        },
        stop: () => {
            running.set(false);
            paused.set(false);
        },
        pause: () => {
            console.log("pausing!");
            paused.set(true);
            paused_at.set(new Date());
        },
        resume: () => {
            console.log(get(paused_at));
            console.log(get(poker_clock));
            console.log(get(paused_at) - get(poker_clock));
            set(new Date(new Date() - (get(paused_at) - get(poker_clock))));
            time_clock.tick();
            paused.set(false);
        },
        tick: () => {
            if (get(running) && !get(paused)) {
                time_clock.tick();
            }
        }
    };
};

export const poker_clock = create_poker_clock();
poker_clock.subscribe(value => {localStorage.setItem("poker_clock", value)});

const elapsed_time = derived(
    [poker_clock, time_clock, paused, paused_at],
    ([$poker_clock, $time_clock, $paused, $paused_at]) => {
        if ($paused)
            return Math.trunc(($paused_at - $poker_clock) / 1000);
        else
            return Math.trunc(($time_clock - $poker_clock) / 1000);
    }
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
    [cycle_time_remaining, running, paused],
    ([$cycle_time_remaining, $running, $paused]) => {
        return ($running && ($paused || $cycle_time_remaining < 30 && $cycle_time_remaining % 2 == 1));
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

