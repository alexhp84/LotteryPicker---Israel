import random
green = "\033[0;32m"
blue = "\033[0;94m"
reset = "\033[0m"

special = 1,2,3,4,5,6,7
regular = list(range(1, 37 + 1))

for i in range(10):
    regular_picks = sorted(random.sample(regular, 6))
    special_pick = random.choice(special)
    print('****************')
    print(f"{green}Regular Numbers: {reset}{', '.join(map(str, regular_picks))}")
    print(f"{blue}Special Number: {reset}{special_pick}")
