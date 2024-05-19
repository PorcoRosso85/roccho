{
  description = "A simple flake";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      packages = forAllSystems (system: {
        hello = nixpkgs.legacyPackages.${system}.hello;
      });
      defaultPackage = forAllSystems (system:
        nixpkgs.legacyPackages.${system}.hello
      );
    };

}
