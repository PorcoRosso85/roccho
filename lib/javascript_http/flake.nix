{
  description = "Hello World HTTP server";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          develop = import ./nix/develop.nix { inherit pkgs; };
          run = import ./nix/run.nix { inherit pkgs; };
        in
        {
          defaultPackage = run;
          devShell = develop;
        }
      );
}
