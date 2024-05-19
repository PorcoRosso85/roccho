{
  description = "A simple flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    sub.url = "path:./sub";
  };

  outputs = { self, nixpkgs, sub }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      packages = forAllSystems (system: {
        hello = nixpkgs.legacyPackages.${system}.hello;
        subHello = sub.packages.${system}.hello;
      });
      defaultPackage = forAllSystems (system:
        # nixpkgs.legacyPackages.${system}.hello
        # self.packages.${system}.hello

        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        pkgs.writeShellScriptBin "hello" ''
          ${self.packages.${system}.hello}/bin/hello
          ${self.packages.${system}.subHello}/bin/hello
        ''
      );
    };

}
