{
  description = "A simple flake";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: {

    packages.x86_64-linux = with nixpkgs.legacyPackages.x86_64-linux; {
      hello = hello;
    };

    defaultPackage.x86_64-linux = self.packages.x86_64-linux.hello;

  };
}
