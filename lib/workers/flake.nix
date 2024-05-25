{
  description = "Hello World HTTP server";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          develop = { pkgs }:
            pkgs.mkShell
              {
                buildInputs = [ pkgs.nodejs pkgs.nodePackages.pnpm ];
              };

          run = { pkgs }:
            pkgs.writeShellScriptBin "hello" ''echo "Hello, world!"'';

        in
        {
          devShell = develop { inherit pkgs; };
          defaultPackage = run { inherit pkgs; };
        }
      );
}
