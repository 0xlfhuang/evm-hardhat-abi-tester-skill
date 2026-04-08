# Contributing

Thanks for your interest in improving `evm-hardhat-abi-tester-skill`.

## Ways To Contribute

- Report bugs or unclear behavior
- Suggest workflow, prompt, or template improvements
- Improve documentation and examples
- Refine installer behavior for supported tools
- Expand the Hardhat scaffold and test patterns

## Before Opening A Pull Request

- Make sure your change fits the scope of this repository: installable skill bundle, templates, onboarding docs, and scaffold assets
- Keep behavior aligned with `skill/evm-hardhat-abi-tester/SKILL.md`
- Run the installer smoke test when installer behavior, templates, or generated outputs may be affected:

```bash
./scripts/test-installer.sh
```

## Pull Request Guidelines

- Keep pull requests focused and easy to review
- Update documentation when behavior or usage changes
- Avoid committing secrets, private keys, or real `.env` values
- Prefer safe defaults for contract interaction, especially for write tests

## Issues

- Bug reports: include the install mode, tool, expected behavior, and actual behavior
- Usage issues: include the prompt you used and which files were installed
- Feature requests: describe the user workflow you want to improve

## Security And Safety

This project is designed for ABI-driven interaction with deployed contracts. Please avoid proposing changes that encourage unsafe defaults for funded wallets or state-changing tests without confirmation.
