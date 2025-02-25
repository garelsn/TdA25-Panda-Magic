import math
def expected_score(RA, RB):
    """Výpočet očekávaného skóre podle klasické Elo formule."""
    return 1 / (1 + 10 ** ((RB - RA) / 400))

def think_different_elo(RA, RB, SA, W, D, L):
    """
    Výpočet nového Elo ratingu pomocí Think Different Elo Formula.
    """
    EA = expected_score(RA, RB)
    WDL_ratio = (W + D) / (W + D + L) if (W + D + L) > 0 else 0
    adjustment_factor = 1 + 0.5 * (0.5 - WDL_ratio)
    new_RA = RA + 40 * ((SA - EA) * adjustment_factor)
    return math.ceil(new_RA)