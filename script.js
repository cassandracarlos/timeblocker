const timeline = document.getElementById("timeline");

const MINUTE_HEIGHT = 2; // 1 minute = 2px
const START_HOUR = 6;
const END_HOUR = 22;
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;

for (let h = START_HOUR; h <= END_HOUR; h++) {
    const y = (h - START_HOUR) * 60 * MINUTE_HEIGHT;

    const line = document.createElement("div");
    line.className = "hour-line";
    line.style.top = y + "px";

    const label = document.createElement("div");
    label.className = "hour-label";
    label.style.top = (y - 8) + "px";
    label.textContent = h + ":00";

    timeline.appendChild(line);
    timeline.appendChild(label);
}

timeline.style.height = TOTAL_MINUTES * MINUTE_HEIGHT + "px";

document.querySelectorAll(".block").forEach(block => {
    block.addEventListener("dragstart", e => {
        e.dataTransfer.setData("duration", block.dataset.duration);
        e.dataTransfer.setData("colorClass", block.classList[1]);
        e.dataTransfer.setData("text", block.textContent);
    });
});

function makePlacedBlockDraggable(el) {
    el.draggable = true;
    el.addEventListener("dragstart", e => {
        e.dataTransfer.setData("placed", "true");
        e.dataTransfer.setData("duration", el.dataset.duration);
        e.dataTransfer.setData("colorClass", el.dataset.colorClass);
        e.dataTransfer.setData("text", el.textContent);
        e.dataTransfer.setData("offsetY", e.offsetY);
        el.remove();
    });
}

timeline.addEventListener("dragover", e => e.preventDefault());

timeline.addEventListener("drop", e => {
    const duration = parseInt(e.dataTransfer.getData("duration"));
    const colorClass = e.dataTransfer.getData("colorClass");
    const text = e.dataTransfer.getData("text");

    const block = document.createElement("div");
    block.className = "placed-block " + colorClass;

    const height = duration * MINUTE_HEIGHT;
    block.style.height = height + "px";

    let y = e.offsetY;
    y = Math.max(0, Math.min(y, TOTAL_MINUTES * MINUTE_HEIGHT - height));
    y = Math.round(y / MINUTE_HEIGHT) * MINUTE_HEIGHT;

    let adjustedY = y;
    let collision = true;

    while (collision) {
        collision = false;

        document.querySelectorAll(".placed-block").forEach(other => {
            const oy = parseInt(other.style.top);
            const oh = parseInt(other.style.height);
            const overlap = !(adjustedY + height <= oy || adjustedY >= oy + oh);
            if (overlap) {
                adjustedY = oy + oh;
                collision = true;
            }
        });
    }

    block.style.top = adjustedY + "px";
    block.textContent = text;

    block.dataset.duration = duration;
    block.dataset.colorClass = colorClass;

    makePlacedBlockDraggable(block);
    timeline.appendChild(block);
});