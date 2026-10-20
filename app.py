from flask import Flask, render_template, request
import random

app = Flask(__name__)


def generate_numbers(count: int, minimum: int, maximum: int, exclude: list[int] | None = None) -> list[int]:
    """Generate unique numbers in the requested range, excluding any supplied numbers."""
    if minimum > maximum:
        raise ValueError("Minimum number must be less than or equal to maximum number.")

    excluded = set(exclude or [])
    available = [number for number in range(minimum, maximum + 1) if number not in excluded]
    if count < 0 or count > len(available):
        raise ValueError(
            f"You requested {count} unique numbers, but only {len(available)} are available in this range."
        )
    return sorted(random.sample(available, count))


@app.route("/", methods=["GET", "POST"])
def index():
    count, minimum, maximum, bonus_count = 6, 1, 49, 0
    numbers = None
    bonuses = []
    error = None

    if request.method == "POST":
        try:
            count = int(request.form.get("quantity", "6"))
            minimum = int(request.form.get("minimum", "1"))
            maximum = int(request.form.get("maximum", "49"))
            bonus_count = int(request.form.get("bonusCount", "0"))

            if not 1 <= count <= 20:
                raise ValueError("Choose between 1 and 20 main numbers.")
            if bonus_count not in (0, 1, 2):
                raise ValueError("Choose 0, 1, or 2 bonus numbers.")
            if not (-1_000_000_000 <= minimum <= 1_000_000_000):
                raise ValueError("The minimum must be between -1,000,000,000 and 1,000,000,000.")
            if not (-1_000_000_000 <= maximum <= 1_000_000_000):
                raise ValueError("The maximum must be between -1,000,000,000 and 1,000,000,000.")
            if minimum > maximum:
                raise ValueError("Minimum number must be less than or equal to maximum number.")
            if maximum - minimum + 1 < count + bonus_count:
                raise ValueError("The selected range must contain enough unique numbers for the main and bonus numbers.")

            numbers = generate_numbers(count, minimum, maximum)
            bonuses = generate_numbers(bonus_count, minimum, maximum, exclude=numbers)
        except ValueError as exc:
            error = str(exc)

    return render_template(
        "index.html",
        count=count,
        minimum=minimum,
        maximum=maximum,
        bonus_count=bonus_count,
        numbers=numbers,
        bonuses=bonuses,
        error=error,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
