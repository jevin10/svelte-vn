{
  description = "Node.js development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_latest;
        npmLatest = pkgs.nodePackages.npm.override {
          inherit nodejs;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            nodejs
            npmLatest
          ];

          shellHook = ''
            echo "Node.js $(node --version) environment"
            echo "NPM $(npm --version)"
          '';
        };
      }
    );
}
