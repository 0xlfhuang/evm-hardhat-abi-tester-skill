# Safety Rules

## Default Safety Posture

- Read tests come first
- Write tests stay skipped by default
- Never assume a write method is safe just because it exists in the ABI

## Enable A Write Test Only When All Are True

- the contract address is confirmed
- the target network alias is confirmed
- the method name is confirmed from ABI plus docs
- argument values are confirmed
- the user understands that a real transaction will be sent

## Strong Recommendations

- Prefer `staticCall` before the real transaction when supported
- Keep each write case isolated so it can be run with `--grep`
- Print the transaction hash and the most relevant receipt details
- If docs are vague, stop and ask instead of guessing

## Stop Conditions

Do not unskip or generate an executable write case when:
- the address is missing
- the docs and ABI disagree
- the method requires unclear tuple or bytes payloads
- the side effect is high-risk and the user has not clearly approved execution
