import sys
import time
import board
import busio
import digitalio
from adafruit_mcp230xx.mcp23017 import MCP23017

i2c = busio.I2C(board.SCL, board.SDA)
mcp = MCP23017(i2c, address = 0x20)

param = sys.argv[1]

pin = mcp.get_pin(int(param))
pin.switch_to_input(pull = digitalio.Pull.UP)

value = pin.value
print("Value:", value)