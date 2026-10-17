from flask import Flask, render_template, request
import random

app = Flask(__name__)

def generate_numbers(count: int, minimum: int, maximum: int) -> list[int]:
    if minimum > maximum:
        raise ValueError("Minimum number must be less than or equal to maximum number.")
    available = maximum - minimum + 1
    if count > available:
        raise ValueError(
            f"You requested {count} unique numbers, but this range contains only {available} numbers."
        )
    return sorted(random.sample(range(minimum, maximum + 1), count))

@app.route("/", methods=["GET", "POST"])
def index():
    count, minimum, maximum = 6, 1, 37
    numbers = None
    error = None

    if request.method == "POST":
        try:
            count = int(request.form.get("count", "6"))
            minimum = int(request.form.get("minimum", "1"))
            maximum = int(request.form.get("maximum", "37"))
            if not 1 <= count <= 500:
                raise ValueError("Choose between 1 and 500 numbers.")
            if not (-1_000_000_000 <= minimum <= 1_000_000_000):
                raise ValueError("The minimum must be between -1,000,000,000 and 1,000,000,000.")
            if not (-1_000_000_000 <= maximum <= 1_000_000_000):
                raise ValueError("The maximum must be between -1,000,000,000 and 1,000,000,000.")
            numbers = generate_numbers(count, minimum, maximum)
        except ValueError as exc:
            error = str(exc)

    return render_template(
        "index.html",
        count=count,
        minimum=minimum,
        maximum=maximum,
        numbers=numbers,
        error=error,
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
