<script>
    export let colour;

    // Have to do something like this rather than dynamically
    // generate with "bg-"+colour or similar, because otherwise
    // Tailwind won't see that I need these colours when it scans
    // the source, and will leave them out of the resultant css.
    const colour_classes = {
        "white":    "bg-white",
        "blue":     "bg-blue-700",
        "green":    "bg-green-600",
        "red":      "bg-red-600",
    };

</script>

<span class={"h-12 w-12 md:h-24 md:w-24 rounded-full "+colour_classes[colour]} />

