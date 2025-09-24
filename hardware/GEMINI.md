# Eurorack Power Supply Design Guide

Designing a power supply for a Eurorack modular synthesizer is a critical step in building a stable and noise-free system. Here is a guide based on information from various online resources.

### 1. Understanding Eurorack Power Requirements

A Eurorack power supply needs to provide three DC voltages:

* **+12V:** The primary power rail for most modules.
* **-12V:** A negative voltage rail, also essential for most analog modules.
* **+5V:** Often required for digital modules, though many newer digital modules have on-board regulators to create +5V from the +12V rail.

### 2. Calculating Current Needs

Before choosing or designing a power supply, you must calculate the total current your modules will draw on each of the three voltage rails.

* **Sum the Current:** Add up the current draw (in milliamperes, mA) for each module on the +12V, -12V, and +5V rails. You can find these values in the module's documentation.
* **Use a Calculator:** Websites like **ModularGrid** are invaluable for planning your rack and automatically calculating the total power consumption.
* **Add Headroom:** It is crucial to have more power available than your modules require. A common recommendation is to have at least 20-30% headroom to avoid stressing the power supply and to accommodate power-on surges.

### 3. Types of Power Supplies: Linear vs. Switching

There are two main types of power supplies used for Eurorack systems:

#### a) Linear Power Supplies

Linear power supplies are known for being very low-noise, which is ideal for audio applications. They typically consist of:

1. **Transformer:** Steps down the mains AC voltage.
2. **Rectifier:** Converts the AC to DC.
3. **Filtering Capacitors:** Smooth out the DC voltage.
4. **Voltage Regulators:** Integrated circuits (ICs) like the **LM7812 (+12V)** and **LM7912 (-12V)** provide a stable output voltage.

* **Pros:** Very low noise, simple designs.
* **Cons:** Inefficient (generate more heat), heavy, and bulky due to the transformer.

Here are some resources for DIY linear power supplies:

* **AI Synthesis:** Provides a detailed guide and schematic for a DIY linear power supply.
* **Music From Outer Space (MFOS):** The MFOS Wall Wart power supply is a classic and well-documented project.

#### b) Switching Power Supplies (SMPS)

Switching power supplies are more modern and efficient. They are lighter and smaller than linear supplies, but they can introduce high-frequency noise if not properly designed and filtered.

* **Pros:** Highly efficient (less heat), lightweight, and compact.
* **Cons:** Can introduce noise into the audio path if not well-designed.

Many commercially available Eurorack power supplies are switching supplies that are specifically designed for audio applications with extensive filtering.

### 4. Power Distribution

The power supply delivers power to the modules via a **bus board**.

* **Bus Board:** A PCB with multiple headers that your modules connect to via ribbon cables.
* **Ribbon Cables:** These cables have either 10 or 16 pins. The 16-pin version includes the +5V rail and CV/Gate lines.
* **Polarity:** The ribbon cable has a **red stripe** that indicates the **-12V** side. It is *extremely important* to connect the ribbon cable correctly to both the bus board and the module. Misconnecting it can permanently damage your modules. Always check the documentation for your modules and bus board for the correct orientation.

### 5. Safety First

Working with mains voltage is dangerous.

* **Use an External Power Brick:** The safest approach for a DIY power supply is to use an external AC-AC or DC power adapter (a "wall wart" or "power brick"). This keeps the dangerous mains voltage outside of your case.
* **Fuses and Protection:** Your power supply design should include fuses to protect against over-current situations. Reverse polarity protection (usually a diode on the module's power input) is also a very important feature.
* **Testing:** Before connecting any modules, use a multimeter to test the output of your power supply to ensure the voltages are correct.

### 6. DIY Schematics and Resources

For those interested in building their own power supply, here are some popular and well-documented projects:

* **Frequency Central's FC Power:** A simple and effective DIY-friendly power supply.
* **Doepfer A-100 DIY page:** Offers schematics and information for building a DIY power supply that is similar to the one used in their A-100 cases.

When building a DIY power supply, it is crucial to follow the schematics carefully and to understand the function of each component. If you are new to electronics, it is highly recommended to start with a well-documented kit.
