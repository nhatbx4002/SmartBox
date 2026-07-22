import sys
import time
import board
import busio
from adafruit_mcp230xx.mcp23017 import MCP23017

i2c = busio.I2C(board.SCL, board.SDA)
mcp = MCP23017(i2c, address = 0x20)

param = sys.argv[1]

pin = mcp.get_pin(int(param))
pin.switch_to_output(value = False)

pin.value = True
time.sleep(0.1)
pin.value = False